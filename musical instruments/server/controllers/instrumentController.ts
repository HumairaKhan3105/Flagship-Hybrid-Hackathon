import { Request, Response, NextFunction } from 'express';
import { Instrument } from '../models/Instrument.ts';
import { initialInstruments, InstrumentData } from '../data/instrumentsData.ts';
import { getIsMongoConnected } from '../config/db.ts';

// In-memory working collection for when MongoDB server is not running
let inMemoryInstruments: InstrumentData[] = initialInstruments.map((item, idx) => ({
  ...item,
  _id: item._id || `mem_${idx + 1}_${item.slug}`,
}));

export const instrumentController = {
  // GET /api/instruments
  async getAllInstruments(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, state, family, region, sort } = req.query;

      if (getIsMongoConnected()) {
        const query: Record<string, any> = {};

        if (state) {
          query.state = { $regex: new RegExp(String(state), 'i') };
        }
        if (family && family !== 'All') {
          query.family = family;
        }
        if (region && region !== 'All') {
          query.region = region;
        }
        if (search) {
          const s = String(search).trim();
          query.$or = [
            { name: { $regex: s, $options: 'i' } },
            { alternativeNames: { $regex: s, $options: 'i' } },
            { state: { $regex: s, $options: 'i' } },
            { tradition: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
          ];
        }

        let mongoQuery = (Instrument as any).find(query);

        if (sort === 'a-z') {
          mongoQuery = mongoQuery.sort({ name: 1 });
        } else if (sort === 'region') {
          mongoQuery = mongoQuery.sort({ state: 1 });
        } else if (sort === 'popular') {
          mongoQuery = mongoQuery.sort({ popularity: -1 });
        } else if (sort === 'recent') {
          mongoQuery = mongoQuery.sort({ createdAt: -1 });
        }

        const items = await mongoQuery.exec();
        return res.json({ success: true, count: items.length, data: items });
      }

      // In-Memory Fallback
      let filtered = [...inMemoryInstruments];

      if (state && state !== 'All') {
        const stateStr = String(state).toLowerCase();
        filtered = filtered.filter((i) => i.state.toLowerCase() === stateStr);
      }

      if (family && family !== 'All') {
        const famStr = String(family).toLowerCase();
        filtered = filtered.filter((i) => i.family.toLowerCase() === famStr);
      }

      if (region && region !== 'All') {
        const regStr = String(region).toLowerCase();
        filtered = filtered.filter((i) => i.region.toLowerCase() === regStr);
      }

      if (search) {
        const s = String(search).toLowerCase().trim();
        filtered = filtered.filter(
          (i) =>
            i.name.toLowerCase().includes(s) ||
            i.state.toLowerCase().includes(s) ||
            i.region.toLowerCase().includes(s) ||
            i.tradition.toLowerCase().includes(s) ||
            i.description.toLowerCase().includes(s) ||
            i.alternativeNames?.some((alt) => alt.toLowerCase().includes(s))
        );
      }

      // Sorting
      if (sort === 'a-z') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === 'region') {
        filtered.sort((a, b) => a.state.localeCompare(b.state));
      } else if (sort === 'popular') {
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      } else if (sort === 'recent') {
        filtered.reverse();
      }

      return res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/search?q=
  async searchInstruments(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q ? String(req.query.q).trim() : '';
      if (!query) {
        return res.json({ success: true, count: 0, data: [] });
      }

      if (getIsMongoConnected()) {
        const regex = new RegExp(query, 'i');
        const results = await (Instrument as any).find({
          $or: [
            { name: { $regex: regex } },
            { alternativeNames: { $regex: regex } },
            { state: { $regex: regex } },
            { region: { $regex: regex } },
            { tradition: { $regex: regex } },
            { description: { $regex: regex } },
            { community: { $regex: regex } },
          ],
        }).limit(20);

        return res.json({ success: true, count: results.length, data: results });
      }

      const s = query.toLowerCase();
      const results = inMemoryInstruments.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.alternativeNames?.some((alt) => alt.toLowerCase().includes(s)) ||
          i.state.toLowerCase().includes(s) ||
          i.region.toLowerCase().includes(s) ||
          i.tradition.toLowerCase().includes(s) ||
          i.description.toLowerCase().includes(s) ||
          i.community.toLowerCase().includes(s)
      );

      return res.json({ success: true, count: results.length, data: results });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/featured
  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      if (getIsMongoConnected()) {
        const featured = await (Instrument as any).find({ popularity: { $gte: 85 } })
          .sort({ popularity: -1 })
          .limit(8);
        return res.json({ success: true, count: featured.length, data: featured });
      }

      const featured = [...inMemoryInstruments]
        .filter((i) => (i.popularity || 0) >= 85)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 8);

      return res.json({ success: true, count: featured.length, data: featured });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/random
  async getRandom(req: Request, res: Response, next: NextFunction) {
    try {
      if (getIsMongoConnected()) {
        const count = await (Instrument as any).countDocuments();
        const random = Math.floor(Math.random() * count);
        const instrument = await (Instrument as any).findOne().skip(random);
        return res.json({ success: true, data: instrument });
      }

      const randomIndex = Math.floor(Math.random() * inMemoryInstruments.length);
      const instrument = inMemoryInstruments[randomIndex];
      return res.json({ success: true, data: instrument });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/state/:state
  async getByState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateParam = decodeURIComponent(req.params.state);

      if (getIsMongoConnected()) {
        const items = await (Instrument as any).find({
          state: { $regex: new RegExp(`^${stateParam}$`, 'i') },
        });
        return res.json({ success: true, count: items.length, data: items });
      }

      const items = inMemoryInstruments.filter(
        (i) => i.state.toLowerCase() === stateParam.toLowerCase()
      );
      return res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/family/:family
  async getByFamily(req: Request, res: Response, next: NextFunction) {
    try {
      const familyParam = decodeURIComponent(req.params.family);

      if (getIsMongoConnected()) {
        const items = await (Instrument as any).find({
          family: { $regex: new RegExp(`^${familyParam}$`, 'i') },
        });
        return res.json({ success: true, count: items.length, data: items });
      }

      const items = inMemoryInstruments.filter(
        (i) => i.family.toLowerCase() === familyParam.toLowerCase()
      );
      return res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/instruments/:id
  async getInstrumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (getIsMongoConnected()) {
        let instrument = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          instrument = await (Instrument as any).findById(id);
        }
        if (!instrument) {
          instrument = await (Instrument as any).findOne({
            $or: [{ slug: id }, { name: { $regex: new RegExp(`^${id}$`, 'i') } }],
          });
        }

        if (!instrument) {
          return res.status(404).json({ success: false, message: 'Instrument not found' });
        }
        return res.json({ success: true, data: instrument });
      }

      const item = inMemoryInstruments.find(
        (i) =>
          i._id === id ||
          i.slug === id ||
          i.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
      );

      if (!item) {
        return res.status(404).json({ success: false, message: 'Instrument not found' });
      }
      return res.json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/instruments (Admin/Add)
  async createInstrument(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        alternativeNames,
        state,
        region,
        family,
        tradition,
        origin,
        description,
        history,
        construction,
        howItIsPlayed,
        culturalUses,
        festivals,
        community,
        materials,
        interestingFacts,
        imageUrl,
        audioUrl,
        audioNote,
        popularity,
      } = req.body;

      if (!name || !state || !region || !family || !tradition || !imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name, state, region, family, tradition, and imageUrl',
        });
      }

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      if (getIsMongoConnected()) {
        const newInstrument = await (Instrument as any).create({
          ...req.body,
          slug,
        });
        return res.status(201).json({ success: true, data: newInstrument });
      }

      const newInMemoryItem: InstrumentData = {
        _id: `mem_${Date.now()}`,
        slug,
        name,
        alternativeNames: alternativeNames || [],
        state,
        region,
        family,
        tradition,
        origin: origin || '',
        description: description || '',
        history: history || '',
        construction: construction || '',
        howItIsPlayed: howItIsPlayed || '',
        culturalUses: culturalUses || [],
        festivals: festivals || [],
        community: community || '',
        materials: materials || [],
        interestingFacts: interestingFacts || [],
        imageUrl,
        audioUrl: audioUrl || null,
        audioNote: audioNote || 'C4',
        popularity: popularity || 80,
      };

      inMemoryInstruments.unshift(newInMemoryItem);
      return res.status(201).json({ success: true, data: newInMemoryItem });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/instruments/:id
  async updateInstrument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (getIsMongoConnected()) {
        const updated = await (Instrument as any).findOneAndUpdate(
          { $or: [{ _id: id }, { slug: id }] },
          { $set: req.body },
          { new: true, runValidators: true }
        );
        if (!updated) {
          return res.status(404).json({ success: false, message: 'Instrument not found' });
        }
        return res.json({ success: true, data: updated });
      }

      const index = inMemoryInstruments.findIndex((i) => i._id === id || i.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Instrument not found' });
      }

      inMemoryInstruments[index] = {
        ...inMemoryInstruments[index],
        ...req.body,
      };

      return res.json({ success: true, data: inMemoryInstruments[index] });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/instruments/:id
  async deleteInstrument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (getIsMongoConnected()) {
        const deleted = await (Instrument as any).findOneAndDelete({
          $or: [{ _id: id }, { slug: id }],
        });
        if (!deleted) {
          return res.status(404).json({ success: false, message: 'Instrument not found' });
        }
        return res.json({ success: true, message: 'Instrument removed successfully' });
      }

      const index = inMemoryInstruments.findIndex((i) => i._id === id || i.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Instrument not found' });
      }

      inMemoryInstruments.splice(index, 1);
      return res.json({ success: true, message: 'Instrument removed successfully' });
    } catch (error) {
      next(error);
    }
  },
};
