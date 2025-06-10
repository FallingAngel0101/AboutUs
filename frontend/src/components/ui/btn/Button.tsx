import React from 'react';
import styles from './Button.module.css'; // Исправлен путь

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        fullWidth ? styles.fullWidth : '',
        className
    ].join(' ').trim();

    return (
        <button className={buttonClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;