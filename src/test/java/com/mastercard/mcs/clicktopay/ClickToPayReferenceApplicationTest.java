package com.mastercard.mcs.clicktopay;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ClickToPayReferenceApplicationTest {

	@Test
    void main_runsWithoutException() {
        // Just verify that the main method does not throw
        assertDoesNotThrow(() -> ClickToPayReferenceApplication.main(new String[]{}));
    }
}