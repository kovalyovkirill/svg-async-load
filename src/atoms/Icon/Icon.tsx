import React, { forwardRef, SVGProps, useMemo, useState } from 'react';
import { useDynamicSVGImport } from './hook';
import { TColor } from '@src/models/common';

import clsx from 'clsx';
import styled from './Icon.module.scss';
import { TIconName } from './models';
import { getColorClasses } from '../../utils/getColorClasses';

type TIconSize = 'sm' | 'md' | 'lg';

interface IIconProps extends SVGProps<SVGSVGElement> {
  name: TIconName;
  size?: TIconSize | number;
  disabled?: boolean;
  view?: TColor;
}

interface CSSVariables {
  '--icon-size'?: string;
  '--secondary-color'?: string;
}

type CustomStyle = React.CSSProperties & CSSVariables;

export const Icon = forwardRef<SVGSVGElement, IIconProps>(
  ({ name, href, id, view = 'black', size = 'md', className, target, disabled = false, ...props }, ref) => {
    /** Содержит в себе ReactNode с данными иконки. Используем свойство props, которое и позволят отрисовать иконку */
    const [svgData, setSvgData] = useState<{ props: React.SVGProps<SVGSVGElement> }>();

    const classes = clsx(
      className,
      styled.root,
      disabled && styled.disabled,
      getColorClasses(view),
      styled.size,
      !Number.isFinite(size) && styled[`size_${size}`],
    );

    const styles = useMemo(() => {
      let sizeStyles: undefined | CustomStyle = undefined;

      if (Number.isFinite(size)) {
        sizeStyles = { ['--icon-size']: `${size}px` };
      }

      return sizeStyles ? { ...sizeStyles, ...props.style } : props.style;
    }, [props.style, size]);

    useDynamicSVGImport({ name, onCompleted: setSvgData });

    if (!svgData) return <div className={classes} />;

    return <svg {...svgData.props} className={classes} {...props} data-id={id} ref={ref} style={styles} />;
  },
);

Icon.displayName = 'Icon';
