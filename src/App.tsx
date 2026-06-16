import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { DiamondScene } from '@/components/3d/DiamondScene';
import { HomePage } from '@/pages/HomePage';
import { OrderPage } from '@/pages/OrderPage';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { TrackPage } from '@/pages/TrackPage';
import { AdminPage } from '@/pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <DiamondScene />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
