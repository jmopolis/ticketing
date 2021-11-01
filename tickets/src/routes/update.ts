import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
} from '@jmoptickets/common';

import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();
    if (req.currentUser!.id !== ticket.userId) throw new NotAuthorizedError();
    if (ticket.orderId)
      throw new BadRequestError("Can't edit a reserved ticket");

    ticket.set({ title: req.body.title, price: req.body.price });
    await ticket.save();

    const { id, title, price, userId, version } = ticket;

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id,
      title,
      price,
      userId,
      version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
