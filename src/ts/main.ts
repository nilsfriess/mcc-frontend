enum PieceType {
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King,
  None
}
enum PieceColor {
  Black,
  White
}

class Piece {
  type: PieceType;
  color: PieceColor;

  constructor(type: PieceType = PieceType.None) {
    this.type = type;
  }

  fromFEN(fen: string) {
    // Check if corresponds to White or Black piece
    if (fen == fen.toUpperCase()) {  // White Piece
      this.color = PieceColor.White;
    } else {  // Black Piece
      this.color = PieceColor.Black;
    }

    fen = fen.toLowerCase();

    switch (fen) {
      case 'p':
        this.type = PieceType.Pawn;
        break;
      case 'b':
        this.type = PieceType.Bishop;
        break;
      case 'n':
        this.type = PieceType.Knight;
        break;
      case 'r':
        this.type = PieceType.Rook;
        break;
      case 'q':
        this.type = PieceType.Queen;
        break;
      case 'k':
        this.type = PieceType.King;
        break;
    }
  }

  toFEN(): String {
    let FEN: String = '';
    switch (this.type) {
      case PieceType.Pawn:
        FEN = 'p';
        break;
      case PieceType.Bishop:
        FEN = 'b';
        break;
      case PieceType.Knight:
        FEN = 'n';
        break;
      case PieceType.Rook:
        FEN = 'r';
        break;
      case PieceType.Queen:
        FEN = 'q';
        break;
      case PieceType.King:
        FEN = 'k';
        break;
    }

    if (this.color === PieceColor.White) FEN = FEN.toUpperCase();

    return FEN;
  }
}

class Board {
  pieces: Array<Array<Piece>>;

  constructor(
      fen:
          string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    this.pieces = new Array<Array<Piece>>(8);
    for (let row = 0; row < 8; ++row) {
      this.pieces[row] = new Array<Piece>(8);
      for (let col = 0; col < 8; ++col) {
        this.pieces[row][col] = new Piece();
      }
    }

    this.importFEN(fen);
  }

  // Sets the board up according to the given FEN
  importFEN(fen: string) {
    const fields: String[] = fen.split(' ');
    const ranks: String[] = fields[0].split('/');

    console.log(ranks);


    for (let row = 0; row < 8; ++row) {
      let posInFEN = 0;
      for (let col = 0; col < 8; ++col) {
        let curr = ranks[row][posInFEN];
        posInFEN++;

        // A number means `n` empty squares
        if (curr >= '1' && curr <= '8') {
          const numEmptySquares = parseInt(curr);
          for (let i = 0; i < numEmptySquares; ++i)
            this.pieces[row][col++] = new Piece();
          col--;  // Correct for the last increment
        } else {
          this.pieces[row][col].fromFEN(curr);
        }
      }
    }

    // TODO: Process remainding fields of FEN
  }
}

function setupSquares(
    boardDiv, board: Board, lightColor: string, darkColor: string) {
  // Add squares to html
  let currFile = 'A';  // Used below to display the file inside the board
  let currRank = 8;
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      let color = darkColor;
      if ((row + col) % 2 == 0) color = lightColor;

      let squareElement: HTMLSpanElement =
          document.createElement('span') as HTMLSpanElement;
      squareElement.style.background = color;
      squareElement.classList.add('square');
      const imgElement = document.createElement('IMG');
      squareElement.appendChild(imgElement);

      // Add file names on first rank
      if (row == 7) {
        const fileLabel = document.createElement('span');
        fileLabel.innerHTML = currFile;
        fileLabel.classList.add('fileLabel');
        squareElement.appendChild(fileLabel);

        currFile = String.fromCharCode(currFile.charCodeAt(0) + 1);
      }

      if (col == 7) {
        const rankLabel = document.createElement('span');
        rankLabel.innerHTML = currRank.toString();
        rankLabel.classList.add('rankLabel');
        squareElement.appendChild(rankLabel);

        currRank = currRank - 1;
      }

      boardDiv.appendChild(squareElement);
    }
  }
}

function putPiecesOnBoard(boardDiv, board: Board) {
  const htmlSquare = boardDiv.querySelectorAll('img');
  for (let row = 0; row < 8; ++row) {
    for (let col = 0; col < 8; ++col) {
      const piece = board.pieces[row][col];
      if (piece.toFEN() !== '')
        htmlSquare[8 * row + col].src = 'img/' + piece.toFEN() + '.png';
    }
  }
}


const DarkColor = '#7D00EB';
const LightColor = '#968EEB';

const initialFEN = '8/4b3/4P3/1k4P1/8/ppK5/8/4R3 b - - 1 45';

const board: Board = new Board(initialFEN);

const boardDiv = document.getElementsByClassName('board')[0];

setupSquares(boardDiv, board, LightColor, DarkColor);
putPiecesOnBoard(boardDiv, board);