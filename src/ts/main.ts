enum PieceType {
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King
}
enum PieceColor {
  Black,
  White
}
enum SquareColor {
  Light,
  Dark
}

class Piece {
  type: PieceType;
  color: PieceColor;

  constructor(color: PieceColor) {
    this.color = color;
  }
}

class Square {
  color: SquareColor;
  piece: Piece;

  constructor(color: SquareColor) {
    this.color = color;
  }
}

class Board {
  blackPieces: Piece[];
  whitePieces: Piece[];
  squares: Square[][];

  constructor() {
    // Setup of pieces
    this.blackPieces = new Array<Piece>(16);
    this.whitePieces = new Array<Piece>(16);

    for (let i = 0; i < 16; ++i)
      this.blackPieces[i] = new Piece(PieceColor.Black);

    for (let i = 0; i < 16; ++i)
      this.whitePieces[i] = new Piece(PieceColor.White);

    // The first eight pieces of either color are the pawns
    for (let i = 0; i < 8; ++i) {
      this.blackPieces[i].type = PieceType.Pawn;
      this.whitePieces[i].type = PieceType.Pawn;
    }

    // Setup remaining pieces
    this.blackPieces[8].type = PieceType.Bishop;
    this.blackPieces[9].type = PieceType.Bishop;
    this.whitePieces[8].type = PieceType.Bishop;
    this.whitePieces[9].type = PieceType.Bishop;

    this.blackPieces[10].type = PieceType.Knight;
    this.blackPieces[11].type = PieceType.Knight;
    this.whitePieces[10].type = PieceType.Knight;
    this.whitePieces[11].type = PieceType.Knight;

    this.blackPieces[12].type = PieceType.Rook;
    this.blackPieces[13].type = PieceType.Rook;
    this.whitePieces[12].type = PieceType.Rook;
    this.whitePieces[13].type = PieceType.Rook;

    this.blackPieces[14].type = PieceType.Queen;
    this.blackPieces[14].type = PieceType.Queen;

    this.whitePieces[15].type = PieceType.King;
    this.whitePieces[15].type = PieceType.King;


    this.squares = new Array<Array<Square>>(8);
    for (let row = 0; row < 8; ++row) {
      this.squares[row] = new Array<Square>(8);
      for (let col = 0; col < 8; ++col) {
        // Squares have alternating colors
        let color: SquareColor =
            ((col + row * 8) % 2 == 0 ? SquareColor.Dark : SquareColor.Light);
        this.squares[row][col] = new Square(color);
      }
    }
  }
}

const board = new Board();