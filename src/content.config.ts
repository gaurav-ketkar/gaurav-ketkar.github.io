import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
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
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
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
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reading' }),
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
