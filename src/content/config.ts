import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'completed', 'paused']).default('active'),
    tags: z.array(z.string()).default([]),
    url: z.string().optional(),
    order: z.number().default(0),
  }),
});

const reading = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'queued']).default('queued'),
    rating: z.number().min(1).max(5).optional(),
    coverUrl: z.string().optional(),
    finishedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, projects, reading };
