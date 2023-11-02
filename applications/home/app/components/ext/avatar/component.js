import Component from '@glimmer/component';

export default class ExtAvatarComponent extends Component {
  get innerColor() {
    if (this.args.user !== undefined) return '#' + this.args.user.slug;
    else return 'var(--bs-light)';
  }

  get outerColor() {
    if (this.args.user !== undefined)
      return (
        '#' +
        this.args.user.slug.substr(3, 3) +
        this.args.user.slug.substr(3, 3)
      );
    else return 'var(--bs-primary)';
  }
}
