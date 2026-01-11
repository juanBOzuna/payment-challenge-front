import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
    it('renders with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);
        await user.click(screen.getByText('Click me'));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant by default', () => {
        render(<Button>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn--primary');
    });

    it('applies secondary variant', () => {
        render(<Button variant="secondary">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn--secondary');
    });

    it('applies outline variant', () => {
        render(<Button variant="outline">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn--outline');
    });

    it('applies full width class', () => {
        render(<Button fullWidth>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn--full');
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('respects disabled state', () => {
        render(<Button disabled>Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('passes through other HTML attributes', () => {
        render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
        const button = screen.getByTestId('submit-btn');
        expect(button).toHaveAttribute('type', 'submit');
    });
});
