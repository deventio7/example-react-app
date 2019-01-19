import React from 'react';
import { shallow } from 'enzyme';
import Welcome from '../Welcome';

describe('Welcome', () => {
    it('should create a snapshot', () => {
        const wrapper = shallow(<Welcome />);
        expect(wrapper).toMatchSnapshot();
    });
});
