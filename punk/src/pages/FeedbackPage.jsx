import Feedback from "../components/Feedback";
import Navbar from "../components/Navbar";

const fakeUser = {
  idusuarios: 1,
  nome: "Visitante"
};

export default function FeedbackPage() {
  return (
    <Navbar />,
    <Feedback
      user={fakeUser}
      onLogout={() => {}}
    />
  );
}