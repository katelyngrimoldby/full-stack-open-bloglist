import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Toggle = forwardRef(({ children }, refs) => {
  const[visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      handleClick
    };
  });
  return(
    <>
      {visible && children}
      <button onClick={handleClick}>{visible ? 'Hide' : 'Show'}</button>
    </>
  );
});

Toggle.propTypes = {
  children: PropTypes.node.isRequired
};

Toggle.displayName = 'Toggle';
export default Toggle;