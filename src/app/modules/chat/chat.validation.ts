import { z } from 'zod';

const createChatValidation = z.object({
  body: z.object({
    participants: z
      .array(z.string())
      .length(2, 'must be add in the array user and receiver id'),
    status: z.enum(['accepted', 'blocked']).default('accepted'),
  }),
});
const updateChatValidation = z.object({
  body: z
    .object({
      participants: z
        .array(z.string())
        .length(2, 'must be add in the array user and receiver id'),
      status: z.enum(['accepted', 'blocked']).default('accepted'),
    })
    .deepPartial(),
});

export const chatValidation = {
  createChatValidation,
  updateChatValidation,
};
