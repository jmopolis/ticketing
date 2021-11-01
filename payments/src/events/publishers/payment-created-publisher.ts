import { Subjects, Publisher, PaymentCreatedEvent } from '@jmoptickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
