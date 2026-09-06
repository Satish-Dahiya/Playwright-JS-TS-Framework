// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// ============================================
// Flow: lint → dev → qa → stage → prod (automatic)
// Trigger: Push, PR, or manual build
// Reports: Separate Allure per environment, Playwright HTML, Custom HTML
// ✅ ESLint static code analysis
// ✅ Separate Allure reports per environment
// ✅ Slack notifications for test results
// ✅ Email notifications with all report links
// ============================================
//
// Required Jenkins Credentials:
// ------------------------------------
// slack-token          - Slack Webhook Token (Secret text)
// ============================================
//
// Required Jenkins Plugins:
// ------------------------------------
// - NodeJS Plugin
// - Allure Jenkins Plugin
// - HTML Publisher Plugin
// - Slack Notification Plugin
// - Email Extension Plugin
// - Pipeline Stage View Plugin
// ============================================

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    environment {
        NODE_VERSION = '20'
        CI = 'true'

        // Windows-safe path. Forward slashes work correctly with Node/Playwright.
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.cache/ms-playwright"

        // Do NOT use credentials('slack-webhook-token') here.
        // Slack is configured through Jenkins' Slack Notification configuration.
        EMAIL_RECIPIENTS = 'satishkd99automation@gmail.com'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        // ============================================================
        // CHECKOUT
        // ============================================================

        stage('📥 Verify Environment') {
            steps {
                echo "=============================================="
                echo "Windows Jenkins Environment"
                echo "=============================================="

                bat '''
                    echo Node Version:
                    node --version

                    echo.
                    echo NPM Version:
                    npm --version

                    echo.
                    echo Working Directory:
                    cd
                '''
            }
        }


        // ============================================================
        // ESLINT
        // ============================================================

        stage('🔍 ESLint Analysis') {
            steps {

                echo "Installing NPM dependencies..."

                bat '''
                    call npm ci
                '''

                bat '''
                    if not exist eslint-report mkdir eslint-report
                '''

                script {

                    def eslintStatus = bat(
                        script: 'call npm run lint',
                        returnStatus: true
                    )

                    env.ESLINT_STATUS =
                        eslintStatus == 0 ? 'success' : 'failure'

                    echo "ESLint Status: ${env.ESLINT_STATUS}"
                }

                // Generate ESLint HTML report if available.
                // Do not stop pipeline because of report generation.
                bat '''
                    call npm run lint:report || exit /b 0
                '''
            }

            post {
                always {

                    publishHTML(
                        target: [
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'eslint-report',
                            reportFiles: 'index.html',
                            reportName: 'ESLint Report'
                        ]
                    )

                    archiveArtifacts(
                        artifacts: 'eslint-report/**/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }


        // ============================================================
        // DEV TESTS
        // ============================================================

        stage('🔧 DEV Tests') {
            steps {

                echo "Installing Playwright Chromium..."

                bat '''
                    call npx playwright install chromium
                '''

                bat '''
                    if exist allure-results rmdir /s /q allure-results
                    if exist playwright-report rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results rmdir /s /q test-results
                '''

                script {

                    def devStatus = bat(
                        script: 'call npx playwright test --grep "@sample" --config=playwright.config.dev.ts',
                        returnStatus: true
                    )

                    env.DEV_TEST_STATUS =
                        devStatus == 0 ? 'success' : 'failure'

                    echo "DEV Test Status: ${env.DEV_TEST_STATUS}"
                }

                bat '''
                    if not exist allure-results mkdir allure-results

                    echo Environment=DEV > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.dev.ts >> allure-results\\environment.properties
                '''
            }

            post {
                always {

                    publishHTML(
                        target: [
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'DEV Playwright Report'
                        ]
                    )

                    archiveArtifacts(
                        artifacts: 'playwright-report/**/*,test-results/**/*,allure-results/**/*',
                        allowEmptyArchive: true
                    )

                    bat '''
                        if exist allure-results (
                            if not exist allure-results-dev mkdir allure-results-dev
                            xcopy /E /I /Y allure-results\\* allure-results-dev\\ >nul 2>&1
                        )
                    '''
                }
            }
        }


        // ============================================================
        // QA TESTS
        // ============================================================

        stage('🧪 QA Tests') {
            steps {

                bat '''
                    call npx playwright install chromium
                '''

                bat '''
                    if exist allure-results rmdir /s /q allure-results
                    if exist playwright-report rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results rmdir /s /q test-results
                '''

                script {

                    def qaStatus = bat(
                        script: 'call npx playwright test --grep "@sample" --config=playwright.config.qa.ts',
                        returnStatus: true
                    )

                    env.QA_TEST_STATUS =
                        qaStatus == 0 ? 'success' : 'failure'

                    echo "QA Test Status: ${env.QA_TEST_STATUS}"
                }

                bat '''
                    if not exist allure-results mkdir allure-results

                    echo Environment=QA > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.qa.ts >> allure-results\\environment.properties
                '''
            }

            post {
                always {

                    publishHTML(
                        target: [
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'QA Playwright Report'
                        ]
                    )

                    archiveArtifacts(
                        artifacts: 'playwright-report/**/*,test-results/**/*,allure-results/**/*',
                        allowEmptyArchive: true
                    )

                    bat '''
                        if exist allure-results (
                            if not exist allure-results-qa mkdir allure-results-qa
                            xcopy /E /I /Y allure-results\\* allure-results-qa\\ >nul 2>&1
                        )
                    '''
                }
            }
        }


        // ============================================================
        // STAGE TESTS
        // ============================================================

        stage('🚀 STAGE Tests') {
            steps {

                bat '''
                    call npx playwright install chromium
                '''

                bat '''
                    if exist allure-results rmdir /s /q allure-results
                    if exist playwright-report rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results rmdir /s /q test-results
                '''

                script {

                    def stageStatus = bat(
                        script: 'call npx playwright test --grep "@sample" --config=playwright.config.stage.ts',
                        returnStatus: true
                    )

                    env.STAGE_TEST_STATUS =
                        stageStatus == 0 ? 'success' : 'failure'

                    echo "STAGE Test Status: ${env.STAGE_TEST_STATUS}"
                }

                bat '''
                    if not exist allure-results mkdir allure-results

                    echo Environment=STAGE > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.stage.ts >> allure-results\\environment.properties
                '''
            }

            post {
                always {

                    publishHTML(
                        target: [
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'STAGE Playwright Report'
                        ]
                    )

                    archiveArtifacts(
                        artifacts: 'playwright-report/**/*,test-results/**/*,allure-results/**/*',
                        allowEmptyArchive: true
                    )

                    bat '''
                        if exist allure-results (
                            if not exist allure-results-stage mkdir allure-results-stage
                            xcopy /E /I /Y allure-results\\* allure-results-stage\\ >nul 2>&1
                        )
                    '''
                }
            }
        }


        // ============================================================
        // PROD TESTS
        // ============================================================

        stage('🏭 PROD Tests') {
            steps {

                bat '''
                    call npx playwright install chromium
                '''

                bat '''
                    if exist allure-results rmdir /s /q allure-results
                    if exist playwright-report rmdir /s /q playwright-report
                    if exist playwright-html-report rmdir /s /q playwright-html-report
                    if exist test-results rmdir /s /q test-results
                '''

                script {

                    def prodStatus = bat(
                        script: 'call npx playwright test --grep "@sample" --config=playwright.config.prod.ts',
                        returnStatus: true
                    )

                    env.PROD_TEST_STATUS =
                        prodStatus == 0 ? 'success' : 'failure'

                    echo "PROD Test Status: ${env.PROD_TEST_STATUS}"
                }

                bat '''
                    if not exist allure-results mkdir allure-results

                    echo Environment=PROD > allure-results\\environment.properties
                    echo Browser=Google Chrome >> allure-results\\environment.properties
                    echo Config=playwright.config.prod.ts >> allure-results\\environment.properties
                '''
            }

            post {
                always {

                    publishHTML(
                        target: [
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'PROD Playwright Report'
                        ]
                    )

                    archiveArtifacts(
                        artifacts: 'playwright-report/**/*,test-results/**/*,allure-results/**/*',
                        allowEmptyArchive: true
                    )

                    bat '''
                        if exist allure-results (
                            if not exist allure-results-prod mkdir allure-results-prod
                            xcopy /E /I /Y allure-results\\* allure-results-prod\\ >nul 2>&1
                        )
                    '''
                }
            }
        }


        // ============================================================
        // COMBINED ALLURE REPORT
        // ============================================================

        stage('📊 Generate Combined Allure Report') {
            steps {

                bat '''
                    if exist allure-results-combined rmdir /s /q allure-results-combined

                    mkdir allure-results-combined

                    if exist allure-results-dev (
                        xcopy /E /I /Y allure-results-dev\\* allure-results-combined\\ >nul 2>&1
                    )

                    if exist allure-results-qa (
                        xcopy /E /I /Y allure-results-qa\\* allure-results-combined\\ >nul 2>&1
                    )

                    if exist allure-results-stage (
                        xcopy /E /I /Y allure-results-stage\\* allure-results-combined\\ >nul 2>&1
                    )

                    if exist allure-results-prod (
                        xcopy /E /I /Y allure-results-prod\\* allure-results-combined\\ >nul 2>&1
                    )
                '''

                bat '''
                    if exist allure-results-combined (
                        call npx allure generate allure-results-combined --clean -o allure-report-combined || exit /b 0
                    )
                '''
            }

            post {
                always {

                    archiveArtifacts(
                        artifacts: 'allure-results-combined/**/*,allure-report-combined/**/*',
                        allowEmptyArchive: true
                    )

                    allure(
                        includeProperties: true,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [
                            [
                                path: 'allure-results-combined'
                            ]
                        ]
                    )
                }
            }
        }


        // ============================================================
        // DETERMINE FINAL BUILD RESULT
        // ============================================================

        stage('📌 Determine Final Result') {
            steps {

                script {

                    def devStatus =
                        env.DEV_TEST_STATUS ?: 'unknown'

                    def qaStatus =
                        env.QA_TEST_STATUS ?: 'unknown'

                    def stageStatus =
                        env.STAGE_TEST_STATUS ?: 'unknown'

                    def prodStatus =
                        env.PROD_TEST_STATUS ?: 'unknown'

                    def eslintStatus =
                        env.ESLINT_STATUS ?: 'unknown'

                    echo ""
                    echo "=============================================="
                    echo "📊 TEST RESULTS"
                    echo "=============================================="
                    echo "ESLint : ${eslintStatus}"
                    echo "DEV    : ${devStatus}"
                    echo "QA     : ${qaStatus}"
                    echo "STAGE  : ${stageStatus}"
                    echo "PROD   : ${prodStatus}"
                    echo "=============================================="

                    def testFailed =
                        devStatus == 'failure' ||
                        qaStatus == 'failure' ||
                        stageStatus == 'failure' ||
                        prodStatus == 'failure'

                    def eslintFailed =
                        eslintStatus == 'failure'

                    if (testFailed || eslintFailed) {

                        currentBuild.result = 'FAILURE'

                        env.OVERALL_STATUS = 'FAILURE'
                        env.STATUS_EMOJI = '❌'
                        env.STATUS_COLOR = 'danger'

                    } else {

                        currentBuild.result = 'SUCCESS'

                        env.OVERALL_STATUS = 'SUCCESS'
                        env.STATUS_EMOJI = '✅'
                        env.STATUS_COLOR = 'good'
                    }

                    echo ""
                    echo "Final Pipeline Status: ${env.OVERALL_STATUS}"
                }
            }
        }
    }


    // ================================================================
    // POST ACTIONS
    // ================================================================

    post {

        always {

            script {

                def devStatus =
                    env.DEV_TEST_STATUS ?: 'unknown'

                def qaStatus =
                    env.QA_TEST_STATUS ?: 'unknown'

                def stageStatus =
                    env.STAGE_TEST_STATUS ?: 'unknown'

                def prodStatus =
                    env.PROD_TEST_STATUS ?: 'unknown'

                def eslintStatus =
                    env.ESLINT_STATUS ?: 'unknown'

                echo ""
                echo "=============================================="
                echo "📊 Test Results by Environment:"
                echo "=============================================="
                echo "${devStatus == 'success' ? '✅' : '❌'} DEV: ${devStatus}"
                echo "${qaStatus == 'success' ? '✅' : '❌'} QA: ${qaStatus}"
                echo "${stageStatus == 'success' ? '✅' : '❌'} STAGE: ${stageStatus}"
                echo "${prodStatus == 'success' ? '✅' : '❌'} PROD: ${prodStatus}"
                echo "${eslintStatus == 'success' ? '✅' : '❌'} ESLint: ${eslintStatus}"
                echo "=============================================="

                def finalStatus =
                    currentBuild.currentResult ?: 'FAILURE'

                def statusEmoji =
                    finalStatus == 'SUCCESS' ? '✅' : '❌'

                def slackColor =
                    finalStatus == 'SUCCESS' ? 'good' : 'danger'

                def slackMessage = """
${statusEmoji} Playwright Jenkins Pipeline - ${finalStatus}

Job: ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}

📊 Test Results:
DEV: ${devStatus}
QA: ${qaStatus}
STAGE: ${stageStatus}
PROD: ${prodStatus}
ESLint: ${eslintStatus}

🔗 Build:
${env.BUILD_URL}

📊 Allure Report:
${env.BUILD_URL}allure/
"""

                // ----------------------------------------------------
                // SLACK NOTIFICATION
                // ----------------------------------------------------

                try {

                    slackSend(
                        channel: '#team-playwright-jenkins-slack-channel',
                        color: slackColor,
                        message: slackMessage
                    )

                    echo "Slack notification sent successfully."

                } catch (Exception e) {

                    echo "WARNING: Slack notification failed."
                    echo "Reason: ${e.getMessage()}"
                }


                // ----------------------------------------------------
                // EMAIL NOTIFICATION
                // ----------------------------------------------------

                try {

                    emailext(
                        to: env.EMAIL_RECIPIENTS,
                        subject: "${statusEmoji} Playwright Jenkins Build #${env.BUILD_NUMBER} - ${finalStatus}",
                        from: 'CI Notifications <training@naveenautomationlabs.com>',
                        replyTo: 'training@naveenautomationlabs.com',
                        mimeType: 'text/html',
                        body: """
                            <html>
                            <body>

                            <h2>${statusEmoji} Playwright Jenkins Pipeline - ${finalStatus}</h2>

                            <p>
                                <b>Job:</b> ${env.JOB_NAME}<br>
                                <b>Build:</b> #${env.BUILD_NUMBER}<br>
                                <b>Status:</b> ${finalStatus}
                            </p>

                            <h3>📊 Test Results</h3>

                            <table border="1" cellpadding="8" cellspacing="0">

                                <tr>
                                    <th>Environment</th>
                                    <th>Status</th>
                                </tr>

                                <tr>
                                    <td>DEV</td>
                                    <td>${devStatus}</td>
                                </tr>

                                <tr>
                                    <td>QA</td>
                                    <td>${qaStatus}</td>
                                </tr>

                                <tr>
                                    <td>STAGE</td>
                                    <td>${stageStatus}</td>
                                </tr>

                                <tr>
                                    <td>PROD</td>
                                    <td>${prodStatus}</td>
                                </tr>

                                <tr>
                                    <td>ESLint</td>
                                    <td>${eslintStatus}</td>
                                </tr>

                            </table>

                            <h3>🔗 Jenkins Links</h3>

                            <p>
                                <a href="${env.BUILD_URL}">
                                    Open Jenkins Build
                                </a>
                            </p>

                            <p>
                                <a href="${env.BUILD_URL}allure/">
                                    Open Allure Report
                                </a>
                            </p>

                            <p>
                                Regards,<br>
                                Jenkins CI/CD
                            </p>

                            </body>
                            </html>
                        """
                    )

                    echo "Email notification sent successfully."

                } catch (Exception e) {

                    echo "WARNING: Email notification failed."
                    echo "Reason: ${e.getMessage()}"
                }
            }
        }


        // ------------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------------

        success {

            echo "=============================================="
            echo "✅ Pipeline completed successfully!"
            echo "=============================================="
        }


        // ------------------------------------------------------------
        // FAILURE
        // ------------------------------------------------------------

        failure {

            echo "=============================================="
            echo "❌ Pipeline failed!"
            echo "Please check the Jenkins console and reports."
            echo "=============================================="
        }
    }
}