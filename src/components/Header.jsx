import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title }) => {
  return (
    <header className="text-3xl text-white p-2 text-center bg-red-500">
      <h1>
        {title} <span >&reg;</span>
      </h1>
    </header>
  );
};

Header.defaultProps = {
  title: 'default title',
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
