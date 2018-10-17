/* tslint:disable no-unused-expression */

import indexHtml from '../../src/routes/index.html';

describe('index route', () => {
  it('renders correctly', () => {
    expect.assertions(3);
    const spy = jest.spyOn(global.console, 'error');
    function wrapper() {
      const target = document.createElement('div');
      new indexHtml({ target });
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
});
