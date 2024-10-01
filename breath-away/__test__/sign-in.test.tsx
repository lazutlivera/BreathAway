import { render, screen } from "@testing-library/react-native";
import SignIn from "../app/(auth)/sign-in";

describe("SignIn", () => {
  it("should render correctly", () => {
    render(<SignIn />);
    expect(screen.getByText("SignIn")).toBeDefined();
  });
});
