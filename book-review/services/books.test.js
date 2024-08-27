// bookService.test.js
import { submit } from "./books";
import { getUser } from "../utils/supabase";
import { insertBook } from "../utils/supabase";

jest.mock("../utils/supabase", () => ({
  getUser: jest.fn(),
  insertBook: jest.fn(),
}));

describe("Book Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("submit", () => {
    it("should insert a book when valid user", async () => {
        const testSubmitValues = ["external-id-123", "Book Title", "Author Name"]
        const mockUserValue = 1
      getUser.mockResolvedValueOnce({ data: [{ id: mockUserValue }] });
      await submit(testSubmitValues[0], testSubmitValues[1], testSubmitValues[2]);
      expect(insertBook.mock.calls).toEqual([[mockUserValue, testSubmitValues[1], testSubmitValues[2]]]);
    });
  });
});
