package fr.esgi.tierlist.infrastructure.persistence.adapter;

import fr.esgi.tierlist.domain.port.ObjectStoragePort;
import io.minio.*;
import io.minio.http.Method;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
public class MinioObjectStorageAdapter implements ObjectStoragePort {
    private final MinioClient minioClient;

    public MinioObjectStorageAdapter(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(String bucketName, String objectName, InputStream inputStream,
                             String contentType, long size) {
        try {
            ensureBucketExists(bucketName);

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build()
            );

            return generatePresignedUrl(bucketName, objectName, 7 * 24 * 60 * 60);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO: " + objectName, e);
        }
    }

    @Override
    public Optional<InputStream> downloadFile(String bucketName, String objectName) {
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            return Optional.of(stream);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void deleteFile(String bucketName, String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from MinIO: " + objectName, e);
        }
    }

    @Override
    public boolean fileExists(String bucketName, String objectName) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String generatePresignedUrl(String bucketName, String objectName, int expirationInSeconds) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expirationInSeconds, TimeUnit.SECONDS)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL: " + objectName, e);
        }
    }

    private void ensureBucketExists(String bucketName) throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                        .bucket(bucketName)
                        .build()
        );

        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
        }
    }
}