import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './data/i18n';
import { AuthProvider } from './data/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import AppShell from './pages/AppShell';
import { Crying, Sleep, Feeding } from './pages/TopicPage';
import Diary from './pages/Diary';
import SelfCare from './pages/SelfCare';
import Breathing from './pages/Breathing';
import TrackerShell from './pages/TrackerShell';
import FeedingTracker from './pages/FeedingTracker';
import SleepTracker from './pages/SleepTracker';
import CryingTracker from './pages/CryingTracker';
import GrowthTracker from './pages/GrowthTracker';
import PatternsView from './pages/PatternsView';
import BabyProfile from './pages/BabyProfile';
import AccountPage from './pages/AccountPage';
import Terms from './pages/Terms';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/skilmalar" element={<Terms />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="/app/gratur" replace />} />
              <Route path="gratur"   element={<Crying />} />
              <Route path="svefn"    element={<Sleep />} />
              <Route path="faeding"  element={<Feeding />} />
              <Route path="anda"     element={<Breathing />} />
              <Route path="dagbok"   element={<Diary />} />
              <Route path="sjalfsum" element={<SelfCare />} />
              <Route path="maelar" element={<TrackerShell />}>
                <Route index element={<Navigate to="/app/maelar/faeding" replace />} />
                <Route path="faeding" element={<FeedingTracker />} />
                <Route path="svefn"   element={<SleepTracker />} />
                <Route path="gratur"  element={<CryingTracker />} />
                <Route path="voxtur"  element={<GrowthTracker />} />
                <Route path="mynstur" element={<PatternsView />} />
              </Route>
              <Route path="barn"       element={<BabyProfile />} />
              <Route path="reikningur" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
