import { useState } from 'react';
import styled from 'styled-components';
import Input from '../Input';
import InputLabel from '../InputLabel';

const LabeledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const LabeledInputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${props => props.width || '100%'};
`;

const LabeledInputBody = styled.div`
  display: flex;
  gap: 4px;
`;

const LengthChecker = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.05em;
  color: #525252;
`;

function LabeledInput({
  value,
  handleInputChange,
  headerWidth,
  isShowLengthChecker,
  countInput,
  inputProps,
  inputLabelProps,
}) {
  const [tempValue, setTempValue] = useState('');

  const onChange = ({ target }) => {
    setTempValue(target.value);
  };

  return (
    <LabeledInputContainer>
      <LabeledInputHeader width={headerWidth}>
        <InputLabel {...inputLabelProps} />
        {isShowLengthChecker ? (
          <LengthChecker>
            <span>{value ? value.length : tempValue.length}</span> /{' '}
            <span>{inputProps.maxLength}</span>
          </LengthChecker>
        ) : (
          ''
        )}
      </LabeledInputHeader>
      <LabeledInputBody>
        {countInput >= 2 ? (
          Array.from({ length: countInput }).map((_, index) => (
            <Input
              key={index}
              value={value[index] || tempValue}
              onChange={event => {
                handleInputChange ? handleInputChange(event, index) : onChange(event);
              }}
              {...inputProps}
            />
          ))
        ) : (
          <Input
            value={value || tempValue}
            onChange={handleInputChange || onChange}
            {...inputProps}
          />
        )}
      </LabeledInputBody>
    </LabeledInputContainer>
  );
}

export default LabeledInput;
