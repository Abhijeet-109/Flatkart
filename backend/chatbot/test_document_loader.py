import os
import unittest
from pathlib import Path
from unittest.mock import patch

from pypdf import PdfWriter
from backend.chatbot.document_loader import load_document, _load_pdf_with_pypdf


class DocumentLoaderTests(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path(__file__).resolve().parent / ".test_loader_tmp"
        self.test_dir.mkdir(exist_ok=True)
        self.test_files = []

    def tearDown(self):
        for path in self.test_files:
            if path.exists():
                path.unlink(missing_ok=True)
        if self.test_dir.exists():
            try:
                self.test_dir.rmdir()
            except OSError:
                pass

    def _create_sample_pdf(self, filename="sample.pdf") -> Path:
        path = self.test_dir / filename
        writer = PdfWriter()
        # Add a blank page
        writer.add_blank_page(width=100, height=100)
        with path.open("wb") as f:
            writer.write(f)
        self.test_files.append(path)
        return path

    def test_file_not_found(self):
        with self.assertRaises(FileNotFoundError):
            load_document(self.test_dir / "non_existent.pdf")

    def test_unsupported_format(self):
        dummy = self.test_dir / "dummy.xyz"
        dummy.write_text("hello")
        self.test_files.append(dummy)
        with self.assertRaises(ValueError) as ctx:
            load_document(dummy)
        self.assertIn("Unsupported file format", str(ctx.exception))

    def test_pdf_fallback_when_unstructured_fails(self):
        # Test on one of the real uploaded policy PDFs if available
        upload_dir = Path("backend/uploads")
        pdf_candidates = list(upload_dir.glob("*.pdf")) if upload_dir.exists() else []

        if pdf_candidates:
            pdf_path = pdf_candidates[0]
            # Force UnstructuredLoader to fail (simulating production environment without pdfminer)
            with patch("backend.chatbot.document_loader.UnstructuredLoader") as mock_loader:
                mock_loader.side_effect = ModuleNotFoundError("No module named 'pdfminer'")
                docs = load_document(pdf_path)
                self.assertGreater(len(docs), 0)
                self.assertTrue("page_content" in docs[0])
                self.assertTrue("metadata" in docs[0])
                self.assertEqual(docs[0]["metadata"]["source"], pdf_path.name)
                self.assertTrue(len(docs[0]["page_content"].strip()) > 0)

    def test_load_all_uploaded_pdfs(self):
        upload_dir = Path("backend/uploads")
        if not upload_dir.exists():
            self.skipTest("No backend/uploads directory found")

        pdf_files = list(upload_dir.glob("*.pdf"))
        self.assertGreater(len(pdf_files), 0, "Expected uploaded PDF files for testing")

        for pdf_path in pdf_files:
            docs = load_document(pdf_path)
            self.assertGreater(len(docs), 0, f"Failed to load any text from {pdf_path.name}")
            for doc in docs:
                self.assertIn("page_content", doc)
                self.assertIn("source", doc["metadata"])
                self.assertEqual(doc["metadata"]["source"], pdf_path.name)


if __name__ == "__main__":
    unittest.main()
