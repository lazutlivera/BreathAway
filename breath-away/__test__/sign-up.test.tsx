import { render, screen } from "@testing-library/react-native";
import SignUp from "../app/(auth)/sign-up";

describe("SignUp", () => {
  it("should render correctly", () => {
    render(<SignUp />);
    expect(screen.getByText("SignUp")).toBeDefined();
  });
});
