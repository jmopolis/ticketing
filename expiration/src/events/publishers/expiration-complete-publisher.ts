import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from '@jmoptickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
