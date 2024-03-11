import datetime
from abc import abstractmethod, ABC

from pypdf import PdfReader
from typing import Dict


class InvoiceProcessingException(Exception):
    message = 'Invoice importing was not successful. Are you sure you chose the correct bank institution?'


class PDFInvoiceImporter:
    def __init__(self, file_path, institution):
        self.file_path = file_path
        self.invoice_dict = {'value': None, 'date': None}

        if institution == 'Santander':
            self.processor = SantanderInvoiceProcessor

        elif institution == 'Banco do Brasil':
            self.processor = BancoDoBrasilInvoiceProcessor

        elif institution == 'Nubank':
            self.processor = NubankInvoiceProcessor

        else:
            raise Exception('Unrecognized institution.')

    def process_file(self):
        return self.processor().process_file(self.file_path,
                                             self.invoice_dict)


class InvoiceProcessor(ABC):
    def process_file(self, file_path, invoice_dict):
        file = PdfReader(file_path)

        text = file.pages[0].extract_text()
        invoice_dict = self.generate_dict(text, invoice_dict)

        # Handling brazilian currency values
        import re

        pattern = r'\d+(\.\d+)?'
        match = re.search(pattern, invoice_dict.get('value'))

        if match:
            invoice_dict['value'] = float(match.group().replace('.', ''))

        if isinstance(invoice_dict.get('date'), str):
            invoice_dict['date'] = datetime.datetime.strptime(invoice_dict.get('date'), "%d/%m/%Y - %H:%M:%S")

        return invoice_dict

    @abstractmethod
    def generate_dict(self, text: str, invoice_dict: Dict):
        raise NotImplementedError()


class SantanderInvoiceProcessor(InvoiceProcessor):
    def generate_dict(self, text, invoice_dict):
        chunks = text.split('\n')
        try:
            if (index_value := chunks.index('Valor pago')) != -1:
                invoice_dict['value'] = chunks[index_value + 1]

            if (index_date := chunks.index('Data e hora da transação')) != -1:
                invoice_dict['date'] = chunks[index_date + 1]
        except ValueError:
            raise InvoiceProcessingException()

        return invoice_dict


class BancoDoBrasilInvoiceProcessor(InvoiceProcessor):
    def generate_dict(self, text, invoice_dict):
        chunks = text.split('\n')
        for chunk in chunks:
            if chunk.split()[0] == 'VALOR:':
                invoice_dict['value'] = float(chunk.split()[1].replace(',', '.'))

            if chunk.split()[0] == 'DATA:':
                invoice_dict['date'] = chunk.split()[1]

        return invoice_dict


class NubankInvoiceProcessor(InvoiceProcessor):
    def generate_dict(self, text, invoice_dict):
        # TODO: Implement Nubank importing routine
        raise NotImplementedError()
