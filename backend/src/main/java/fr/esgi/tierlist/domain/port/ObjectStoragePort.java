package fr.esgi.tierlist.domain.port;

import java.io.InputStream;
import java.util.Optional;

public interface ObjectStoragePort {
    String generatePresignedUrl(String bucketName, String objectName, int expirationInSeconds);
    String uploadFile(String bucketName, String objectName, InputStream inputStream,
                      String contentType, long size);
    Optional<InputStream> downloadFile(String bucketName, String objectName);
    void deleteFile(String bucketName, String objectName);
    boolean fileExists(String bucketName, String objectName);
}