import { module, test } from 'qunit';
import { setupRenderingTest } from 'home/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ext/login', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Ext::Login />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Ext::Login>
        template block text
      </Ext::Login>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
