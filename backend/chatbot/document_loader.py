import logging
import os
from pathlib import Path

from langchain_unstructured import UnstructuredLoader
from pypdf import PdfReader

logger = logging.getLogger(__name__)

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".doc",
    ".txt",
    ".rtf",
    ".odt",
    ".pptx",
    ".xlsx",
    ".csv",
    ".tsv",
    ".html",
    ".htm",
    ".xml",
    ".json",
    ".eml",
    ".md",
    ".png",
    ".jpg",
    ".jpeg",
    ".tiff",
    ".bmp",
}


def _load_pdf_with_pypdf(path: Path) -> list[dict]:
    reader = PdfReader(str(path))
    documents = []

    for page_num, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if not text:
            continue
        documents.append({
            "page_content": text,
            "metadata": {
                "source": os.path.basename(path),
                "page": page_num,
            },
        })

    return documents


def load_document(file_path):
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(
            f"Document not found: {path}"
        )

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    documents = []

    # For PDFs, first attempt fast and resilient text extraction via pypdf
    if extension == ".pdf":
        try:
            documents = _load_pdf_with_pypdf(path)
        except Exception as exc:
            logger.warning(
                "pypdf extraction failed for %s (%s). Falling back to UnstructuredLoader.",
                path.name,
                exc,
            )

    # If non-PDF or if pypdf extracted no text (e.g. scanned PDF), use UnstructuredLoader
    if not documents:
        try:
            loader = UnstructuredLoader(
                file_path=str(path),
                strategy="fast",
            )
            loaded_documents = loader.load()

            for document in loaded_documents:
                text = document.page_content.strip()
                if not text:
                    continue

                metadata = dict(document.metadata)
                metadata["source"] = os.path.basename(path)

                documents.append({
                    "page_content": text,
                    "metadata": metadata,
                })
        except Exception as exc:
            logger.warning(
                "UnstructuredLoader extraction failed for %s (%s: %s).",
                path.name,
                type(exc).__name__,
                exc,
            )

    # Final safety fallback for PDF if unstructured also returned nothing
    if extension == ".pdf" and not documents:
        try:
            documents = _load_pdf_with_pypdf(path)
        except Exception as exc:
            logger.error("pypdf final fallback failed for %s: %s", path.name, exc)

    if not documents:
        raise ValueError(
            f"No readable text found in {path.name}"
        )

    return documents
