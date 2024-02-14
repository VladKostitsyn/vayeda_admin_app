const HW_INIT                      = [ 0x1b, 0x40 ] ;            /* Clear data in buffer and reset modes*/
const HW_SELECT                    = [ 0x1b, 0x3d, 0x01 ]  ;       /* Printer select */
const HW_RESET                     = [ 0x1b, 0x3f, 0x0a, 0x00 ]  ; /* Reset printer hardware

/* Feed control sequences*/
const CTL_LF                       = [ 0x0a ] ;                  /* Print and line feed*/
const CTL_FF                       = [ 0x0c ] ;                 /* Form feed*/
const CTL_CR                       = [ 0x0d ] ;                  /* Carriage return*/
const CTL_HT                       = [ 0x09 ] ;                  /* Horizontal tab*/
const CTL_VT                       = [ 0x0b ] ;                  /* Vertical tab*/

/* Beeper*/
const BEEPER    = [ 0x1b,0x42,0x05,0x09 ];  // Beeps 5 times for 9*50ms each time

/* Paper*/
const PAPER_FULL_CUT               = [ 0x1d, 0x56, 0x00 ] ;			   /* Full paper cut */
const PAPER_PARTIAL_CUT            = [ 0x1d, 0x56, 0x01 ] ;			   /* Partial paper cut*/
const PAPER_CUT_A                  = [ 0x1d, 0x56, 0x41 ] ;		   /* Paper cut A*/
const PAPER_CUT_B                  = [ 0x1d, 0x56, 0x42 ] ;			   /* Paper cut B*/

const LINE_SPACE_24   = [0x1b,0x33,24]; // Set the line spacing at 24
const LINE_SPACE_30   = [0x1b,0x33,30]; // Set the line spacing at 30

/* Cash Drawer */
const CD_KICK_2                    = [ 0x1b, 0x70, 0x00 ] ;			   /* Send pulse to pin 2*/
const CD_KICK_5                    = [ 0x1b, 0x70, 0x01 ] ;			   /* Send pulse to pin 5*/


/* Text formating*/
const TXT_NORMAL                   = [ 0x1b, 0x21, 0x00 ] ;       /* Normal text */
const TXT_2HEIGHT                  = [ 0x1b, 0x21, 0x10 ] ;       /* Double height text */
const TXT_2WIDTH                   = [ 0x1b, 0x21, 0x20 ] ;       /* Double width text */
const TXT_4SQUARE                  = [ 0x1b, 0x21, 0x30 ] ;       /* Quad area text */
const TXT_UNDERL_OFF               = [ 0x1b, 0x2d, 0x00 ] ;       /* Underline font OFF*/
const TXT_UNDERL_ON                = [ 0x1b, 0x2d, 0x01 ] ;       /* Underline font 1 */
const TXT_UNDERL2_ON               = [ 0x1b, 0x2d, 0x02 ] ;       /* Underline font 2 */
const TXT_BOLD_OFF                 = [ 0x1b, 0x45, 0x00 ] ;       /* Bold font OFF */
const TXT_BOLD_ON                  = [ 0x1b, 0x45, 0x01 ] ;       /* Bold font ON */
const TXT_FONT_A                   = [ 0x1b, 0x4d, 0x00 ] ;       /* Font type A */
const TXT_FONT_B                   = [ 0x1b, 0x4d, 0x01 ] ;       /* Font type B */
const TXT_ALIGN_LT                 = [ 0x1b, 0x61, 0x00 ] ;       /* Left justification */
const TXT_ALIGN_CT                 = [ 0x1b, 0x61, 0x01 ] ;       /* Centering */
const TXT_ALIGN_RT                 = [ 0x1b, 0x61, 0x02 ] ;       /* Right justification */
const TXT_INVERT_ON                = [ 0x1d, 0x42, 0x01 ] ;       /* Inverted color text */
const TXT_INVERT_OFF               = [ 0x1d, 0x42, 0x00 ] ;       /* Inverted color text */
const TXT_COLOR_BLACK              = [ 0x1b, 0x72, 0x00 ] ;       /* Default Color */
const TXT_COLOR_RED                = [ 0x1b, 0x72, 0x01 ] ;       /* Alternative Color (Usually Red) */


/* Barcodes */
const BARCODE_TXT_OFF             = [ 0x1d, 0x48, 0x00 ] ;       /* HRI barcode chars OFF */
const BARCODE_TXT_ABV             = [ 0x1d, 0x48, 0x01 ] ;        /* HRI barcode chars above */
const BARCODE_TXT_BLW             = [ 0x1d, 0x48, 0x02 ] ;        /* HRI barcode chars below */
const BARCODE_TXT_BTH             = [ 0x1d, 0x48, 0x03 ] ;        /* HRI barcode chars both above and below */
const BARCODE_FONT_A              = [ 0x1d, 0x66, 0x00 ] ;        /* Font type A for HRI barcode chars */
const BARCODE_FONT_B              = [ 0x1d, 0x66, 0x01 ] ;        /* Font type B for HRI barcode chars */
const BARCODE_HEIGHT              = [ 0x1d, 0x68 ]       ;        /* Barcode Height (1 - 255) */
const BARCODE_WIDTH               = [ 0x1d, 0x77 ]       ;        /* Barcode Width (2 - 6) */
const BARCODE_UPC_A               = [ 0x1d, 0x6b, 0x00 ] ;        /* Barcode type UPC-A */
const BARCODE_UPC_E               = [ 0x1d, 0x6b, 0x01 ] ;        /* Barcode type UPC-E */
const BARCODE_EAN13               = [ 0x1d, 0x6b, 0x02 ] ;        /* Barcode type EAN13 */
const BARCODE_EAN8                = [ 0x1d, 0x6b, 0x03 ] ;        /* Barcode type EAN8 */
const BARCODE_CODE39              = [ 0x1d, 0x6b, 0x04 ] ;        /* Barcode type CODE39 */
const BARCODE_ITF                 = [ 0x1d, 0x6b, 0x05 ] ;        /* Barcode type ITF */
const BARCODE_NW7                 = [ 0x1d, 0x6b, 0x06 ] ;        /* Barcode type NW7 */


// Char code table
const CHARCODE_PC437  = [0x1b,0x74,0x00]; // USA){ Standard Europe
const CHARCODE_JIS    = [0x1b,0x74,0x01]; // Japanese Katakana
const CHARCODE_PC850  = [0x1b,0x74,0x02]; // Multilingual
const CHARCODE_PC860  = [0x1b,0x74,0x03]; // Portuguese
const CHARCODE_CHINESE  = [0x1b,0x1C,0x26]; // chinese
const CHARCODE_PC863  = [0x1b,0x74,0x04]; // Canadian-French
const CHARCODE_PC865  = [0x1b,0x74,0x05]; // Nordic
const CHARCODE_WEU    = [0x1b,0x74,0x06]; // Simplified Kanji, Hirakana
const CHARCODE_GREEK  = [0x1b,0x74,0x07]; // Simplified Kanji
const CHARCODE_HEBREW = [0x1b,0x74,0x08]; // Simplified Kanji
const CHARCODE_PC1252 = [0x1b,0x74,0x10]; // Western European Windows Code Set
const CHARCODE_PC866  = [0x1b,0x74,0x12]; // Cirillic //2
const CHARCODE_PC852  = [0x1b,0x74,0x13]; // Latin 2
const CHARCODE_PC858  = [0x1b,0x74,0x14]; // Euro
const CHARCODE_THAI42 = [0x1b,0x74,0x15]; // Thai character code 42
const CHARCODE_THAI11 = [0x1b,0x74,0x16]; // Thai character code 11
const CHARCODE_THAI13 = [0x1b,0x74,0x17]; // Thai character code 13
const CHARCODE_THAI14 = [0x1b,0x74,0x18]; // Thai character code 14
const CHARCODE_THAI16 = [0x1b,0x74,0x19]; // Thai character code 16
const CHARCODE_THAI17 = [0x1b,0x74,0x1a]; // Thai character code 17
const CHARCODE_THAI18 = [0x1b,0x74,0x1b]; // Thai character code 18

/* Code Pages */
const CP_SET                       = [ 0x1b, 0x74 ]	;      		   /* Set Code Page */
const CP_CP437                     = [ 0x0 ] ;
const CP_CP850                     = [ 0x2 ] ;
const CP_CP860                     = [ 0x3 ] ;
const CP_CP863                     = [ 0x4 ] ;
const CP_CP865                     = [ 0x5 ] ;
const CP_CP1251                    = [ 0x6 ] ;
const CP_CP866                     = [ 0x7 ] ;
const CP_MACCYRILLIC               = [ 0x8 ] ;
const CP_CP775                     = [ 0x9 ] ;
const CP_CP1253                    = [ 0x10 ] ;
const CP_CP737                     = [ 0x11 ] ;
const CP_CP857                     = [ 0x12 ] ;
const CP_ISO8859_9                 = [ 0x13 ] ;
const CP_CP864                     = [ 0x14 ] ;
const CP_CP862                     = [ 0x15 ] ;
const CP_ISO8859_2                 = [ 0x16 ] ;
const CP_CP1253_ALT                = [ 0x17 ] ;
const CP_CP1250                    = [ 0x18 ] ;
const CP_CP858                     = [ 0x19 ] ;
const CP_CP1254                    = [ 0x20 ] ;
const CP_CP737_ALT                 = [ 0x24 ] ;
const CP_CP1257                    = [ 0x25 ] ;
const CP_CP847                     = [ 0x26 ] ;
const CP_CP885                     = [ 0x28 ] ;
const CP_CP857_ALT                 = [ 0x29 ] ;
const CP_CP1250_ALT                = [ 0x30 ] ;
const CP_CP775_ALT                 = [ 0x31 ] ;
const CP_CP1254_ALT                = [ 0x32 ] ;
const CP_CP1256                    = [ 0x34 ] ;
const CP_CP1258                    = [ 0x35 ] ;
const CP_ISO8859_2_ALT             = [ 0x36 ] ;
const CP_ISO8859_3                 = [ 0x37 ] ;
const CP_ISO8859_4                 = [ 0x38 ] ;
const CP_ISO8859_5                 = [ 0x39 ] ;
const CP_ISO8859_6                 = [ 0x40 ] ;
const CP_ISO8859_7                 = [ 0x41 ] ;
const CP_ISO8859_8                 = [ 0x42 ] ;
const CP_ISO8859_9_ALT             = [ 0x43 ] ;
const CP_ISO8859_15                = [ 0x44 ] ;
const CP_CP856                     = [ 0x47 ] ;
const CP_CP874                     = [ 0x47 ] ;

/*====================================================
   NEW ESC/POS COMMAND
====================================================*/

const ESC_COMMANDS ={
    LF: '\x0a', //Line feed for new lines
    EOL: '\n', //end of line
    FEED_CONTROL_SEQUENCES: {
        CTL_LF: '\x0a', // Print and line feed
        CTL_FF: '\x0c', // Form feed
        CTL_CR: '\x0d', // Carriage return
        CTL_HT: '\x09', // Horizontal tab
        CTL_VT: '\x0b', // Vertical tab
    },
    LINE_SPACING: {
        LS_DEFAULT: '\x1b\x32',  //Spacing
        LS_SET: '\x1b\x33'  //Spacing
    },
    HARDWARE: {
        HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes
        HW_SELECT: '\x1b\x3d\x01', // Printer select
        HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware
    },
    CASH_DRAWER: {
        CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []
        CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []
    },
    MARGINS: {
        BOTTOM: '\x1b\x4f', // Fix bottom size
        LEFT: '\x1b\x6c', // Fix left size
        RIGHT: '\x1b\x51', // Fix right size
    },
    PAPER: {
        PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper
        PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper
        PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
        PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
    },
    TEXT_FORMAT: {
        TXT_NORMAL: '\x1b\x21\x00', // Normal text
        TXT_2HEIGHT: '\x1b\x21\x10', // Double height text
        TXT_2WIDTH: '\x1b\x21\x20', // Double width text
        TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text

        TXT_CUSTOM_SIZE: function(width, height) { // other sizes
            var widthDec = (width - 1) * 16;
            var heightDec = height - 1;
            var sizeDec = widthDec + heightDec;
            return '\x1d\x21' + String.fromCharCode(sizeDec);
        },

        TXT_HEIGHT: {
            1: '\x00',
            2: '\x01',
            3: '\x02',
            4: '\x03',
            5: '\x04',
            6: '\x05',
            7: '\x06',
            8: '\x07'
        },
        TXT_WIDTH: {
            1: '\x00',
            2: '\x10',
            3: '\x20',
            4: '\x30',
            5: '\x40',
            6: '\x50',
            7: '\x60',
            8: '\x70'
        },

        TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF
        TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON
        TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON
        TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
        TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON
        TXT_ITALIC_OFF: '\x1b\x35', // Italic font ON
        TXT_ITALIC_ON: '\x1b\x34', // Italic font ON

        TXT_FONT_A: '\x1b\x4d\x00', // Font type A //normal font
        TXT_FONT_B: '\x1b\x4d\x01', // Font type B //small font
        TXT_FONT_C: '\x1b\x4d\x02', // Font type C //normal font

        TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification
        TXT_ALIGN_CT: '\x1b\x61\x01', // Centering
        TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification
    },
    BARCODE_FORMAT: {
        BARCODE_TXT_OFF: '\x1d\x48\x00', // HRI barcode chars OFF
        BARCODE_TXT_ABV: '\x1d\x48\x01', // HRI barcode chars above
        BARCODE_TXT_BLW: '\x1d\x48\x02', // HRI barcode chars below
        BARCODE_TXT_BTH: '\x1d\x48\x03', // HRI barcode chars both above and below

        BARCODE_FONT_A: '\x1d\x66\x00', // Font type A for HRI barcode chars
        BARCODE_FONT_B: '\x1d\x66\x01', // Font type B for HRI barcode chars

        BARCODE_HEIGHT: function(height) { // Barcode Height [1-255]
            return '\x1d\x68' + String.fromCharCode(height);
        },
        // Barcode Width  [2-6]
        BARCODE_WIDTH: {
            1: '\x1d\x77\x02',
            2: '\x1d\x77\x03',
            3: '\x1d\x77\x04',
            4: '\x1d\x77\x05',
            5: '\x1d\x77\x06',
        },
        BARCODE_HEIGHT_DEFAULT: '\x1d\x68\x64', // Barcode height default:100
        BARCODE_WIDTH_DEFAULT: '\x1d\x77\x01', // Barcode width default:1

        BARCODE_UPC_A: '\x1d\x6b\x00', // Barcode type UPC-A
        BARCODE_UPC_E: '\x1d\x6b\x01', // Barcode type UPC-E
        BARCODE_EAN13: '\x1d\x6b\x02', // Barcode type EAN13
        BARCODE_EAN8: '\x1d\x6b\x03', // Barcode type EAN8
        BARCODE_CODE39: '\x1d\x6b\x04', // Barcode type CODE39
        BARCODE_ITF: '\x1d\x6b\x05', // Barcode type ITF
        BARCODE_NW7: '\x1d\x6b\x06', // Barcode type NW7
        BARCODE_CODE93: '\x1d\x6b\x48', // Barcode type CODE93
        BARCODE_CODE128: '\x1d\x6b\x49', // Barcode type CODE128
    },
    CODE2D_FORMAT: {
        TYPE_PDF417: '\x1b\x5a\x00',
        TYPE_DATAMATRIX: '\x1b\x5a\x01',
        TYPE_QR: '\x1b\x5a\x02',
        CODE2D: '\x1b\x5a',
    },
    IMAGE_FORMAT: {
        S_RASTER_N: '\x1d\x76\x30\x00', // Set raster image normal size
        S_RASTER_2W: '\x1d\x76\x30\x01', // Set raster image double width
        S_RASTER_2H: '\x1d\x76\x30\x02', // Set raster image double height
        S_RASTER_Q: '\x1d\x76\x30\x03', // Set raster image quadruple
    },
    BITMAP_FORMAT: {
        BITMAP_S8: '\x1b\x2a\x00',
        BITMAP_D8: '\x1b\x2a\x01',
        BITMAP_S24: '\x1b\x2a\x20',
        BITMAP_D24: '\x1b\x2a\x21'
    },
    GSV0_FORMAT: {
        GSV0_NORMAL: '\x1d\x76\x30\x00',
        GSV0_DW: '\x1d\x76\x30\x01',
        GSV0_DH: '\x1d\x76\x30\x02',
        GSV0_DWDH: '\x1d\x76\x30\x03'
    }
};