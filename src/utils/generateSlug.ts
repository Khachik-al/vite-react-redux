import slugify from 'slugify'

slugify.extend({
  '+': 'plus',
  _: '-',
  ':': 'colon',
  ';': 'semicolon',
  '@': 'at',
  '~': '-',
})

export const generateSlug = (s: string) => slugify(s, {
  replacement: '-',
  remove: undefined,
  lower: true,
  trim: false,
  strict: true,
})
