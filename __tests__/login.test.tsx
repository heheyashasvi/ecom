import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LoginPage from '../src/app/auth/login/page'

// Mocking useSearchParams since the Login page uses it wrapped in Suspense
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            push: jest.fn(),
        };
    },
    useSearchParams() {
        return {
            get: jest.fn(),
        };
    },
}));

describe('Login Page', () => {
    it('renders a heading', () => {
        render(<LoginPage />)

        const heading = screen.getByText('Admin Login')

        expect(heading).toBeInTheDocument()
    })
})
