/* tslint:disable no-unused-expression */

import NavHtml from '../Nav.html';

describe('Nav component', () => {
  it('renders correctly', () => {
    expect.assertions(3);
    const spy = jest.spyOn(global.console, 'error');
    function wrapper() {
      const target = document.createElement('div');
      new NavHtml({ target });
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
});
