/** React */
import React from 'react';

/** Types */
import { BaseDayComponentProps } from './BaseDayComponent.types';

/** Constants */
import { classNames } from './BaseDayComponent.constants';

import { cl } from '../../../../helpers';

import { isToday } from '../../Calendar.helpers';

const BaseDayComponent: React.FC<BaseDayComponentProps> = ({ date, inSelectedMonth, customDate }) => {
  return (
    <div
      className={cl(
        classNames.baseDay,
        !inSelectedMonth && classNames.outsideCurrentMonth,
        customDate?.className,
				isToday(date) && 'is-current-day'
      )}
      title={customDate?.tooltip}
    >
      {date.getDate()}
    </div>
  );
};

export default BaseDayComponent;
