import { module, test } from 'qunit';
import { setupTest } from 'home/tests/helpers';

module('Unit | Service | pusher', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:pusher');
    assert.ok(service);
  });
});
