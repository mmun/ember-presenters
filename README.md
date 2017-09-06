# ember-presenters

This addon provides a template helper for presenting your data in your templates.
See [usage](#usage).

###  But why?

Of course, this could also be accomplished with a component but presenters offer a few advantages in some cases:

- Component names are required to contain a hyphen. Presenter names are not.
- Unlike components, when you use a presenter, it is immediately obvious that no extra DOM elements are introduced
- With a component, you are forced to write a template that often only contains `{{yield data}}`.

## Installation

```
ember install ember-presenters
```

## Usage

### The `present` helper

#### General form

```hbs
(present presenterName key1=value1 ... keyN=valueN)
```

- `presenterName`: The name of the presenter, e.g. 'post' or 'dashboard/news-item'. Must be a string.
- `key1=value1 ... keyN=value`: Properties that will be passed to the presenter. They are optional.

#### Examples

##### Decorating items in a list

```js
// app/presenters/comment.js
import Ember from 'ember';
import moment from 'moment';

export default Ember.Object.extend({
  isRecent: Ember.computed('comment.createdAt', function() {
    let createdAt = moment(this.get('comment.createdAt'));
    return createdAt.add(7, 'days').isAfter();
  })
})
```

```hbs
{{#each posts as |post|}}
  {{#each post.comments as |comment|}}
    {{#with (present 'comment' comment=comment) as |commentPresenter|}}
      <div>
        <p>{{comment.body}}</p>
        {{#if commentPresenter.isRecent}}
          <div>This is a recent comment.</div>
        {{/if}}
      </div>
    {{/with}}
  {{/each}}
{{/each}}
```
