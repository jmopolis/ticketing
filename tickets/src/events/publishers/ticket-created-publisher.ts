import { Publisher, Subjects, TicketCreatedEvent } from '@jmoptickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
