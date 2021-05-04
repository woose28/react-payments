import React from 'react';
import { Icon } from '../';
import './style.css';

export default function Header({ title }) {
  return (
    <div className="header">
      <Icon.LeftArrow size="16px" color="#525252" />
      <h1 className="header__title">{title}</h1>
    </div>
  );
}
