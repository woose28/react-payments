import { useState, useMemo, useEffect } from 'react';
import Head from '../components/Head';
import Card from '../components/Card';
import LabeledInput from '../components/LabeledInput';
import InfoLabel from '../components/InfoLabel';
import SubmitButton from '../components/SubmitButton';
import validator from '../validation';
import Input from '../components/Input';
import { Page, CardSection, Form, FormRow, SubmitButtonContainer } from '../style/page';
import {
  cardNumberInputRegex,
  expiredDateInputRegex,
  ownerNameInputRegex,
  numberRegex,
} from '../constant/regularExpression';
import MESSAGE from '../constant/message';

function CardAddPage() {
  const [companyName, setCompanyName] = useState('포코카드');
  const [cardNumbers, setCardNumbers] = useState([]);
  const [expiredDate, setExpiredDate] = useState({ month: '', year: '' });
  const [ownerName, setOwnerName] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [password, setPassword] = useState(['', '']);
  const [cardAddCondition, setCardAddCondition] = useState({
    cardNumbers: false,
    expiredDate: false,
    ownerName: false,
    securityNumber: false,
    password: false,
  });

  const convertedCardNumbers = useMemo(() => {
    return cardNumbers.map((cardNumber, index) =>
      index >= 2 ? '●'.repeat(cardNumber.length) : cardNumber
    );
  }, [cardNumbers]);

  const convertedExpiredDate = useMemo(() => {
    return expiredDate.month || expiredDate.year
      ? `${expiredDate.month}${expiredDate.month.length === 2 ? '/' : ''}${expiredDate.year}`
      : '';
  }, [expiredDate]);

  useEffect(() => {
    setCardAddCondition({
      cardNumbers: validator.validateCardNumbers(cardNumbers.join('-')),
      expiredDate: validator.validateExpiredDate(convertedExpiredDate),
      ownerName: validator.validateOwnerName(ownerName),
      securityNumber: validator.validateSecurityNumber(securityNumber),
      password: validator.validatePassword(password.join('')),
    });
  });

  const handleChangeCardNumbersInput = ({ nativeEvent: { data, inputType }, target }) => {
    if (validator.isInvalidInputData(cardNumberInputRegex, data, inputType)) {
      return;
    }

    const inputCardNumbers = target.value.split('-');
    const targetIndex = convertedCardNumbers.findIndex(
      (numbers, index) => numbers !== inputCardNumbers[index]
    );

    if (inputCardNumbers.join().length < convertedCardNumbers.join().length) {
      const newCardNumbers = cardNumbers.filter((_, index) => index !== targetIndex);
      setCardNumbers(newCardNumbers);
      return;
    }

    if (targetIndex === -1) {
      setCardNumbers(cardNumbers.concat([inputCardNumbers[inputCardNumbers.length - 1]]));
      return;
    }

    if (targetIndex < 2) {
      setCardNumbers(inputCardNumbers);
      return;
    }

    const numberIndex = inputCardNumbers[targetIndex]
      .split('')
      .findIndex(char => char === '0' || Number(char));

    if (numberIndex == -1) {
      return;
    }

    const inputNumber = inputCardNumbers[targetIndex][numberIndex];
    const newCardNumbers = cardNumbers.map((number, index) => {
      if (index === targetIndex) {
        return number.length === numberIndex
          ? number + inputNumber
          : number.slice(0, numberIndex) + inputNumber + number.slice(numberIndex);
      }
      return number;
    });
    setCardNumbers(newCardNumbers);
  };

  const handleChangeExpiredDateInput = ({ nativeEvent: { data, inputType }, target }) => {
    if (validator.isInvalidInputData(expiredDateInputRegex, data, inputType)) {
      return;
    }

    if (inputType === 'deleteContentBackward' && target.value.length === 2) {
      setExpiredDate({ month: expiredDate.month[0], year: '' });
      return;
    }

    const [month, year] = target.value.split('/');

    setExpiredDate({ month: month || '', year: year || '' });
  };

  const handleChangeOwnerNameInput = ({ nativeEvent: { data, inputType }, target }) => {
    if (validator.isInvalidInputData(ownerNameInputRegex, data, inputType)) {
      return;
    }

    setOwnerName(target.value.toUpperCase());
  };

  const handleChangeSecurityNumber = ({ nativeEvent: { data, inputType }, target }) => {
    if (validator.isInvalidInputData(numberRegex, data, inputType)) {
      return;
    }

    setSecurityNumber(target.value);
  };

  const handleChangePassword = ({ nativeEvent: { data, inputType }, target }, index) => {
    if (validator.isInvalidInputData(numberRegex, data, inputType)) {
      return;
    }

    const updatedPassword = password.map((number, aaa) => (aaa === index ? target.value : number));
    setPassword(updatedPassword);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (Object.values(cardAddCondition).every(value => value === true)) {
      alert(MESSAGE.SAVE_CARD_INFO);
    }
  };

  return (
    <Page>
      <Head title="카드 추가" />
      <CardSection>
        <Card
          companyName={companyName}
          cardNumbers={convertedCardNumbers}
          ownerName={ownerName}
          expiredDate={convertedExpiredDate}
        />
      </CardSection>
      <Form onSubmit={handleSubmit}>
        <LabeledInput
          value={convertedCardNumbers.join('-')}
          handleInputChange={handleChangeCardNumbersInput}
          invalidMessage={MESSAGE.INVALID_CARD_NUMBER}
          inputProps={{
            type: 'text',
            width: '318px',
            maxLength: 19,
            placeholder: 'ex. 0000-0000-0000-0000',
            isValid: cardAddCondition.cardNumbers,
          }}
          inputLabelProps={{
            label: '카드 번호',
          }}
        />
        <LabeledInput
          value={convertedExpiredDate}
          handleInputChange={handleChangeExpiredDateInput}
          invalidMessage={MESSAGE.INVALID_EXPIRED_DATE}
          inputProps={{
            type: 'text',
            width: '137px',
            maxLength: 5,
            placeholder: 'MM / YY',
            isValid: cardAddCondition.expiredDate,
          }}
          inputLabelProps={{
            label: '만료일',
          }}
        />
        <LabeledInput
          value={ownerName}
          handleInputChange={handleChangeOwnerNameInput}
          headerWidth="318px"
          isShowLengthChecker={true}
          invalidMessage={MESSAGE.INVALID_OWNER_NAME}
          inputProps={{
            type: 'text',
            width: '318px',
            placeholder: '카드에 표시된 이름과 동일하게 입력하세요.',
            isCenter: false,
            maxLength: 30,
            isValid: cardAddCondition.ownerName,
          }}
          inputLabelProps={{
            label: '카드 소유자 이름(선택)',
          }}
        />
        <FormRow>
          <LabeledInput
            value={securityNumber}
            handleInputChange={handleChangeSecurityNumber}
            invalidMessage={MESSAGE.INVALID_SECURITY_NUMBER}
            inputProps={{
              type: 'password',
              width: '84px',
              maxLength: 3,
              isValid: cardAddCondition.securityNumber,
            }}
            inputLabelProps={{
              label: '보안 코드(CVC/CVV)',
            }}
          />
          <InfoLabel />
        </FormRow>
        <FormRow alignItems="flex-end" gap={'4px'}>
          <LabeledInput
            value={password}
            handleInputChange={handleChangePassword}
            countInput={2}
            invalidMessage={MESSAGE.INVALID_PASSWORD}
            inputProps={{
              type: 'password',
              width: '43px',
              maxLength: 1,
              isValid: cardAddCondition.password,
            }}
            inputLabelProps={{
              label: '카드 비밀번호',
            }}
          />
          {Array.from({ length: 2 }).map((_, index) => (
            <Input
              key={index}
              type="password"
              defaultValue="."
              width="43px"
              maxLength={1}
              disabled={true}
              backgroundColor="#fff"
            />
          ))}
        </FormRow>
        <SubmitButtonContainer>
          <SubmitButton
            label="다음"
            width={'51px'}
            height={'34px'}
            hidden={Object.values(cardAddCondition).some(value => value === false)}
          />
        </SubmitButtonContainer>
      </Form>
    </Page>
  );
}

export default CardAddPage;
