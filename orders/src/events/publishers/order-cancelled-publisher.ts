import { Subjects, Publisher, OrderCancelledEvent } from '@jmoptickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
