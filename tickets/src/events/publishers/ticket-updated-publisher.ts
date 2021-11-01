import { Publisher, Subjects, TicketUpdatedEvent } from '@jmoptickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
