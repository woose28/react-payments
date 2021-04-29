import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import RegisterInputWrapper from '../../shared/RegisterInputWrapper';
import EllipseSvg from '../../../assets/secure-ellipse-cyan.svg';
import * as Style from './style';

const CardPasswordInput = (props) => {
  const { type, label, cardPassword, setCardPassword } = props;

  const firstInput = useRef(null);
  const secondInput = useRef(null);

  const passwordMark = Array.from({ length: 2 }).map((_, idx) => (
    <Style.PasswordMark key={idx}>
      <img src={EllipseSvg} alt="password-mark" />
    </Style.PasswordMark>
  ));

  const handleChangeNumbers = (event) => {
    const currentValue = event.target.value;
    const index = Number(event.target.dataset.passwordIdx);

    if (isNaN(currentValue)) return;

    if (index === 1) {
      moveFocusToNextFragment();
    } else if (index === 2) {
      if (currentValue.length > 1) return;
    }

    setCardPassword((prevPassword) => ({ ...prevPassword, [index]: currentValue }));
  };

  const moveFocusToNextFragment = () => {
    secondInput.current.focus();
  };

  return (
    <>
      <RegisterInputWrapper type={type} label={label} width={'100%'}>
        <Style.InputWrapper>
          <Style.PasswordInput
            type="password"
            value={cardPassword[1]}
            data-password-idx="1"
            onChange={handleChangeNumbers}
            ref={firstInput}
            required
          />
        </Style.InputWrapper>
        <Style.InputWrapper>
          <Style.PasswordInput
            type="password"
            value={cardPassword[2]}
            data-password-idx="2"
            onChange={handleChangeNumbers}
            ref={secondInput}
            required
          />
        </Style.InputWrapper>
        {passwordMark}
      </RegisterInputWrapper>
    </>
  );
};

CardPasswordInput.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  cardPassword: PropTypes.object.isRequired,
  setCardPassword: PropTypes.func.isRequired,
};

export default CardPasswordInput;
