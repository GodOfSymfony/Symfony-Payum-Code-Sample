<?php
/**
 * This file is part of the Symfony2-coding-standard (phpcs standard)
 *
 * PHP version 5
 *
 * @category PHP
 * @package  PHP_CodeSniffer-Symfony2
 * @author   Symfony2-phpcs-authors <Symfony2-coding-standard@opensky.github.com>
 * @license  http://spdx.org/licenses/MIT MIT License
 * @version  GIT: master
 * @link     https://github.com/opensky/Symfony2-coding-standard
 */

if (class_exists('PEAR_Sniffs_Commenting_FunctionCommentSniff', true) === false) {
    $error = 'Class PEAR_Sniffs_Commenting_FunctionCommentSniff not found';
    throw new PHP_CodeSniffer_Exception($error);
}

/**
 * Symfony2 standard customization to PEARs FunctionCommentSniff.
 *
 * Verifies that :
 * <ul>
 *  <li>There is a &#64;return tag if a return statement exists inside the method</li>
 * </ul>
 *
 * @category PHP
 * @package  PHP_CodeSniffer
 * @author   Felix Brandt <mail@felixbrandt.de>
 * @license  http://spdx.org/licenses/BSD-3-Clause BSD 3-clause "New" or "Revised" License
 * @link     http://pear.php.net/package/PHP_CodeSniffer
 */
class Ecommerce121_Sniffs_Commenting_FunctionCommentSniff extends PEAR_Sniffs_Commenting_FunctionCommentSniff
{

    /**
     * Processes this test, when one of its tokens is encountered.
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return void
     */
    public function process(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        if (false === $commentEnd = $phpcsFile->findPrevious(array(T_COMMENT, T_DOC_COMMENT, T_CLASS, T_FUNCTION, T_OPEN_TAG), ($stackPtr - 1))) {
            return;
        }

        $tokens = $phpcsFile->getTokens();
        $code = $tokens[$commentEnd]['code'];

        // a comment is not required on protected/private methods
        $method = $phpcsFile->getMethodProperties($stackPtr);
        $commentRequired = 'public' == $method['scope'];

        if (($code === T_COMMENT && !$commentRequired)
            || ($code !== T_DOC_COMMENT && !$commentRequired)
        ) {
            return;
        }

        parent::process($phpcsFile, $stackPtr);
    }

    /**
     * Process the return comment of this function comment.
     *
     * @param PHP_CodeSniffer_File $phpcsFile    The file being scanned.
     * @param int                  $stackPtr     The position of the current token
     *                                           in the stack passed in $tokens.
     * @param int                  $commentStart The position in the stack where the comment started.
     *
     * @return void
     */
    protected function processReturn(PHP_CodeSniffer_File $phpcsFile, $stackPtr, $commentStart)
    {

        if ($this->isInheritDoc($phpcsFile, $stackPtr)) {
            return;
        }

        $tokens = $phpcsFile->getTokens();

        // Only check for a return comment if a non-void return statement exists
        if (isset($tokens[$stackPtr]['scope_opener'])) {
            $start = $tokens[$stackPtr]['scope_opener'];

            // iterate over all return statements of this function,
            // run the check on the first which is not only 'return;'
            while ($returnToken = $phpcsFile->findNext(T_RETURN, $start, $tokens[$stackPtr]['scope_closer'])) {
                if ($this->isMatchingReturn($tokens, $returnToken)) {
                    parent::processReturn($phpcsFile, $stackPtr, $commentStart);
                    break;
                }
                $start = $returnToken + 1;
            }
        }

    } /* end processReturn() */

    /**
     * Is the comment an inheritdoc?
     *
     * @param PHP_CodeSniffer_File $phpcsFile The file being scanned.
     * @param int                  $stackPtr  The position of the current token
     *                                        in the stack passed in $tokens.
     *
     * @return boolean True if the comment is an inheritdoc
     */
    protected function isInheritDoc(PHP_CodeSniffer_File $phpcsFile, $stackPtr)
    {
        $tokens = $phpcsFile->getTokens();

        $start = $phpcsFile->findPrevious(T_DOC_COMMENT_OPEN_TAG, $stackPtr - 1);
        $end = $phpcsFile->findNext(T_DOC_COMMENT_CLOSE_TAG, $start);

        $content = $phpcsFile->getTokensAsString($start, ($end - $start));

        return preg_match('#{@inheritdoc}#i', $content) === 1;
    } // end isInheritDoc()

    /**
     * Process the function parameter comments.
     *
     * @param PHP_CodeSniffer_File $phpcsFile    The file being scanned.
     * @param int                  $stackPtr     The position of the current token
     *                                           in the stack passed in $tokens.
     * @param int                  $commentStart The position in the stack where the comment started.
     *
     * @return void
     */
    protected function processParams(PHP_CodeSniffer_File $phpcsFile, $stackPtr, $commentStart)
    {
        $tokens = $phpcsFile->getTokens();

        if ($this->isInheritDoc($phpcsFile, $stackPtr)) {
            return;
        }

        parent::processParams($phpcsFile, $stackPtr, $commentStart);
    } // end processParams()

    /**
     * Is the return statement matching?
     *
     * @param array $tokens    Array of tokens
     * @param int   $returnPos Stack position of the T_RETURN token to process
     *
     * @return boolean True if the return does not return anything
     */
    protected function isMatchingReturn($tokens, $returnPos)
    {
        do {
            $returnPos++;
        } while ($tokens[$returnPos]['code'] === T_WHITESPACE);

        return $tokens[$returnPos]['code'] !== T_SEMICOLON;
    }

}//end class
