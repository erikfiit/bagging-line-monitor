import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

/** A text without a translation (e.g. an unknown machine type) shows "labeler", not "types.labeler". */
export class ShowLastPartOfKey extends MissingTranslationHandler {
  handle({ key }: MissingTranslationHandlerParams) {
    return key.split('.').at(-1) ?? key;
  }
}
