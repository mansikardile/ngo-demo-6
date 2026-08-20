import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  collegeName: z.string().min(2, 'College name is required'),
  location: z.string().optional(),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid event date format',
  }),
  description: z.string().optional(),
  code: z
    .string()
    .min(3, 'Event code must be at least 3 characters')
    .regex(/^[A-Za-z0-9-_]+$/, 'Code can only contain letters, numbers, hyphens, and underscores')
    .optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  isActive: z.boolean().optional(),
});

function generateUniqueEventCode(collegeName: string): string {
  const cleanName = collegeName
    .replace(/[^A-Za-z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `KAT-${year}-${cleanName || 'STEM'}-${randomSuffix}`;
}

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, collegeName, location, eventDate, description, code } = req.body;

    const eventCode = code?.trim().toUpperCase() || generateUniqueEventCode(collegeName);

    // Check if code already exists
    const existing = await prisma.event.findUnique({
      where: { code: eventCode },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Event code '${eventCode}' already exists. Please choose a different code.`,
      });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        collegeName: collegeName.trim(),
        location: location?.trim() || null,
        eventDate: new Date(eventDate),
        description: description?.trim() || null,
        code: eventCode,
        createdById: req.user?.id || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { leads: true },
        },
        leads: {
          select: {
            status: true,
          },
        },
      },
    });

    // Format with lead counts
    const formatted = events.map((ev) => {
      const registered = ev.leads.filter((l) => l.status === 'REGISTERED').length;
      const started = ev.leads.filter((l) => l.status === 'STARTED').length;
      const completed = ev.leads.filter((l) => l.status === 'COMPLETED').length;

      return {
        id: ev.id,
        code: ev.code,
        title: ev.title,
        collegeName: ev.collegeName,
        location: ev.location,
        eventDate: ev.eventDate,
        description: ev.description,
        isActive: ev.isActive,
        createdAt: ev.createdAt,
        totalLeads: ev._count.leads,
        funnelBreakdown: {
          registered,
          started,
          completed,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const event = await prisma.event.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true,
        code: true,
        title: true,
        collegeName: true,
        location: true,
        eventDate: true,
        description: true,
        isActive: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with code '${code}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
