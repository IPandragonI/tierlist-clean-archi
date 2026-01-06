package fr.esgi.tierlist.application.view;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import fr.esgi.tierlist.application.dto.StatDto;
import fr.esgi.tierlist.domain.model.TierListLogoMove;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.util.List;
import java.util.Map;

public class ExportStatPdfView extends AbstractPdfView {

    private static final String CONTENT_TYPE = "application/pdf";
    private static final String HEADER_CONTENT_DISPOSITION = "Content-Disposition";
    private static final String HEADER_CONTENT_VALUE = "attachment; filename=\"Tierlists_Stats.pdf\"";

    private static final String TITLE = "TierList Stats";
    private static final float MARGIN_LEFT = 50f;
    private static final float MARGIN_TOP = 50f;
    private static final float LINE_SPACING = 20f;

    private final StatCalculator calculator = new StatCalculator();

    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document document, PdfWriter writer,
                                    HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setContentType(CONTENT_TYPE);
        response.setHeader(HEADER_CONTENT_DISPOSITION, HEADER_CONTENT_VALUE);

        @SuppressWarnings("unchecked")
        List<TierListLogoMove> logoMoves = (List<TierListLogoMove>) model.get("tierListLogoMoves");

        StatDto stats = calculator.compute(logoMoves);

        PdfContentByte contentByte = writer.getDirectContent();
        BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);

        float yPosition = drawTitle(contentByte, baseFont, document);
        drawStats(contentByte, baseFont, yPosition, stats);
    }

    private float drawTitle(PdfContentByte contentByte, BaseFont baseFont, Document document) {
        float yPosition = document.getPageSize().getHeight() - MARGIN_TOP;
        contentByte.beginText();
        contentByte.setFontAndSize(baseFont, 16);
        contentByte.showTextAligned(Element.ALIGN_LEFT, TITLE, MARGIN_LEFT, yPosition, 0);
        contentByte.endText();
        return yPosition - 30f;
    }

    private void drawStats(PdfContentByte contentByte, BaseFont baseFont, float startY,
                           StatDto stats) {
        contentByte.beginText();
        contentByte.setFontAndSize(baseFont, 12);

        float yPosition = startY;

        boolean hasAnyData = false;

        if (stats.getBestAverageRankLogo() != null) {
            hasAnyData = true;
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Logo avec meilleure moyenne de rang : " + stats.getBestAverageRankLogo().getName(),
                    MARGIN_LEFT, yPosition, 0);
            yPosition -= LINE_SPACING;
        }

        if (stats.getWorstAverageRankLogo() != null) {
            hasAnyData = true;
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Logo avec pire moyenne de rang : " + stats.getWorstAverageRankLogo().getName(),
                    MARGIN_LEFT, yPosition, 0);
            yPosition -= LINE_SPACING;
        }

        if (stats.getMostMovedLogo() != null) {
            hasAnyData = true;
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Logo le plus déplacé : " + stats.getMostMovedLogo().getName(),
                    MARGIN_LEFT, yPosition, 0);
            yPosition -= LINE_SPACING;
        }

        if (stats.getMostMovedLogoUser() != null) {
            hasAnyData = true;
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Utilisateur ayant le plus déplacé ce logo : " + stats.getMostMovedLogoUser().getUsername(),
                    MARGIN_LEFT, yPosition, 0);
            yPosition -= LINE_SPACING;
        }

        if (stats.getWorstAverageRankMainUser() != null) {
            hasAnyData = true;
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Utilisateur ayant le plus placé le logo le moins bien classé : "
                            + stats.getWorstAverageRankMainUser().getUsername(),
                    MARGIN_LEFT, yPosition, 0);
            yPosition -= LINE_SPACING;
        }

        if (!hasAnyData) {
            contentByte.showTextAligned(Element.ALIGN_LEFT,
                    "Aucune donnée disponible pour cette synthèse.",
                    MARGIN_LEFT, yPosition, 0);
        }

        contentByte.endText();
    }
}
