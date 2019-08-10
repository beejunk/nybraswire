import { shallow } from 'enzyme';
import DateBadge from '../DateBadge';

describe('DateBadge', () => {
  let wrapper;

  beforeEach(() => {
    const date = new Date('2019-08-10T17:34:00Z');
    wrapper = shallow(<DateBadge timestamp={date.getTime()} />);
  });

  it('should pass snapshot test', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
