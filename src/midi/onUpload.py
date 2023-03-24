import midiReader as mr
import modMidi as mod
import os
import sys
from whoosh import index
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID, STORED
from whoosh.index import open_dir
from whoosh.query import Every
from whoosh.qparser import QueryParser
from whoosh import qparser

class index():
    def __init__(self, indexdir, filesdir):
        self.indexdir = indexdir
        self.filesdir = filesdir

    def get_schema(self):
        return Schema(path=ID(unique=True, stored=True), time=STORED)

    def add_doc(self, writer, path):
        modtime = os.path.getmtime(path)
        writer.add_document(path=str(os.path.basename(path)), time=modtime)

    def new_index(self):
        if not os.path.exists(self.indexdir):
            os.mkdir(self.indexdir)
        ix = create_in(self.indexdir, schema = self.get_schema())
        writer = ix.writer()

        filepaths = [os.path.join(self.filesdir,i) for i in os.listdir(self.filesdir)]
        for path in filepaths:
            self.add_doc(writer, path)
        writer.commit()

    def incremental_index(self):
        try:
             ix = open_dir(self.indexdir)
        except:
            print("Index not found")
            return None

        indexed_paths = set()	#the set of all paths in index
        to_index = set()		#the paths we need to re-index

        with ix.searcher() as searcher:
            writer = ix.writer()

            for fields in searcher.all_stored_fields():
                indexed_path = fields['path']
                indexed_paths.add(indexed_path)

                # remove file if it no longer exists
                if not os.path.exists(indexed_path):
                    writer.delete_by_term('path', indexed_path)

                else:
                    # check if file was changed since it was last indexed
                    indexed_time = fields['time']
                    mtime = os.path.getmtime(indexed_path)
                    if mtime > indexed_time:
                        writer.delete_by_term('path', indexed_path)
                        to_index.add(indexed_path)

            # index files that need indexed
            filepaths = [os.path.join(self.filesdir,i) for i in os.listdir(self.filesdir)]
            for path in filepaths:
                if path in to_index or path not in indexed_paths:
                    self.add_doc(writer, path)
            writer.commit()

    def index_docs(self, clean=True):
        if clean:
            self.new_index()
        else:
            self.incremental_index()

    def index_size(self):
        try:
            ix = open_dir()
        except:
            print("Index not found")
            return None
        num = ix.searcher().doc_count_all()
        return num

    def search(self, query, qsize=3):
        try:
            ix = open_dir(self.indexdir)
        except:
            print("Index not found")
            return None
        qp = QueryParser("path", schema=self.get_schema())
        q = qp.parse(query)
        try: 
            s = ix.searcher()
            results = s.search(q, limit=qsize)
        except:
            print("No Results Found\n")
        else:
            for r in results:
                print(r,"\n")
        finally:
            s.close()


def onUpload(self):
    # file selection tool
    # once midi file is verified -> download to midiFiles
    # call determine main channel
    # call to musicArray
    # call modMidi
    pass

def onSelect(self):
    # user input -> search to determine the midiFile we want to select
    # select corresponding json file as well
    # return errors if neither found
    pass

if __name__ == "__main__":
    obj = index("indexdir", "midifiles")
    #obj.index_docs()
    obj.search("MichaelJackson-BillieJean")