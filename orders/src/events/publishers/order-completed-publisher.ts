import { Subjects, OrderCompletedEvent, Publisher } from '@jmoptickets/common';

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}
