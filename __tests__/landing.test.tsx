import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {Hero} from '@/components/hero';
 
describe('Page', () => {
  it('renders a heading', () => {
    render(<Hero />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})